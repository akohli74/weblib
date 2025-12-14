from .UserDatabase import UserDatabase
from .BookDatabase import BookDatabase

from datetime import date, datetime, timedelta

class TransactionDatabase(UserDatabase, BookDatabase):

  REGULAR_DUE_DATE_INCREMENT = 14
  GUEST_DUE_DATE_INCREMENT = REGULAR_DUE_DATE_INCREMENT // 2

  @staticmethod
  def get_current_date() -> str:
    return date.today().strftime("%Y-%m-%d")

  def get_due_date(self, userIsGuest) -> str:
    if userIsGuest:
      return (date.today() + timedelta(days=self.GUEST_DUE_DATE_INCREMENT)).strftime("%Y-%m-%d")
    else:
      return (date.today() + timedelta(days=self.REGULAR_DUE_DATE_INCREMENT)).strftime("%Y-%m-%d")

  def checkOut(self, userId: int, bookIdentifierType: str,
               bookIdentifierEntry, notes: str = ''):

    #======= Book Info. Retrieval =======

    book = self.get_book(identifierType=bookIdentifierType, identifierEntry=bookIdentifierEntry)
    bookStatus, bookInfo = book

    if bookStatus == 1:
      return 1, "[ERROR]: NONEXISTENT BOOK!"

    bookId = bookInfo["BookID"]
    bookISBN = bookInfo["ISBN"]
    bookIsAvailable = True if bookInfo["CheckedOut"] == 0 else False

    #======= Checkout Control =======

    if not bookIsAvailable:
      return 1, "[ERROR]: BOOK ALREADY CHECKED OUT!"

    #======= User Info. Retrieval =======

    user = self.get_user(identifier=userId)
    userStatus, userInfo = user

    if userStatus == 1:
      return 1, "[ERROR]: NONEXISTENT USER!"

    #======= CheckOut =======

    currentDate = self.get_current_date()
    dueDate = self.get_due_date(userInfo["isGuest"])

    cur = self.conn.execute(
      "INSERT INTO transactions (UserID, BookID, LastAction, CheckOutDate, DueDate, Note) VALUES (?, ?, ?, ?, ?, ?)",
      (userId, bookId, "CHECKEDOUT", currentDate, dueDate, notes)
    )

    transactionId = cur.lastrowid

    self.conn.commit()
    cur.close()

    #======= Book Entry Update =======

    bookUpdateStatus, bookUpdateMessage = self.update_book(isbn=bookISBN, isCheckedOut=True, currentTransactionId=transactionId)

    #======= User Profile Update =======

    userUpdateStatus, userUpdateMessage = self.update_user(userID=userId, status="Active")

    #======= Final CheckOut Status =======

    if bookUpdateStatus == 0 and userUpdateStatus == 0:
      return 0, f"[SUCCESS]: CHECKOUT TRANSACTION CREATED!"
    elif bookUpdateStatus == 1:
      return 1, bookUpdateMessage
    else:
      return 1, userUpdateMessage

  def checkIn(self, userId: int, bookISBN: int, notes: str = ''):

    #======= Book Info. Retrieval =======

    book = self.get_book(identifierType="ISBN", identifierEntry=bookISBN)
    bookStatus, bookInfo = book

    if bookStatus == 1:
      return 1, "[ERROR]: NONEXISTENT BOOK!"

    bookISBN = bookInfo["ISBN"]
    bookCurrentTransactionId = bookInfo["CurrentTransactionID"]
    bookIsAvailable = False if bookInfo["CheckedOut"] == 1 else True

    #======= User Info. Retrieval =======

    user = self.get_user(identifier=userId)
    userStatus, userInfo = user

    if userStatus == 1:
      return 1, "[ERROR]: NONEXISTENT USER!"

    userId = userInfo["UserID"]

    #======= CheckIn Control =======

    if bookIsAvailable:
      return 1, "[ERROR]: BOOK IS AVAILABLE, CANNOT BE CHECKED-IN!"

    _, current_transaction_info = self.retrieve_transaction(bookCurrentTransactionId)

    if current_transaction_info["UserID"] != userId:
      return 1, "[ERROR]: ONLY THE CURRENT BOOK HOLDER CAN RETURN THIS BOOK!"

    #======= CheckIn =======

    currentDate = self.get_current_date()

    self.conn.execute(
      "UPDATE transactions SET LastAction = ?, CheckInDate = ?, Note = ? WHERE TransactionID = ?",
      ("CHECKEDIN", currentDate, notes, bookCurrentTransactionId)
    )

    self.conn.commit()

    #======= Book Entry Update =======

    bookUpdateStatus, bookUpdateMessage = self.update_book(isbn=bookISBN, isCheckedOut=False, currentTransactionId=0)

    # ======= User Profile Update =======

    userUpdateStatus, userUpdateMessage = self.update_user(userID=userId, status="Inactive", fees=0)

    #======= Final CheckIn Status =======

    if bookUpdateStatus == 0 and userUpdateStatus == 0:
      return 0, f"[SUCCESS]: CHECKOUT TRANSACTION UPDATED --> CHECK-IN!"
    elif bookUpdateStatus == 1:
      return 1, bookUpdateMessage
    else:
      return 1, userUpdateMessage

  def retrieve_transaction(self, transactionId: int):

    cur = self.conn.execute(
      "SELECT * FROM transactions WHERE TransactionID = ?",
      (transactionId,)
    )

    row = cur.fetchone()
    cur.close()

    if not row:
      return 1, f"[ERROR]: NO TRANSACTION COULD BE RETRIEVED FOR TransactionID={transactionId}"
    else:
      return 0, dict(row)

  def retrieve_user_transactions(self, userId: int):

    cur = self.conn.execute(
      "SELECT * FROM transactions WHERE UserID = ?",
      (userId,)
    )

    rows = cur.fetchall()
    cur.close()

    if not rows:
      return 1, f"[ERROR] NO TRANSACTIONS FOUND FOR UserID={userId}"
    else:
      rows = [dict(row) for row in rows]
      return 0, rows

  def retrieve_all_transactions(self):

    cur = self.conn.execute(
      "SELECT * FROM transactions"
    )

    result = cur.fetchall()
    cur.close()

    if len(result) == 0:
      return 1, "[ERROR] NO TRANSACTION FOUND!"
    else:
      rows = [dict(row) for row in result]
      return 0, rows

  def retrieve_book_transactions(self, isbn: int):
    pass #FIXME: TO BE IMPLEMENTED IF NEEDED!

  def set_late_fees(self):

    cur = self.conn.execute(
      "SELECT * FROM transactions WHERE CheckInDate = ?",
      ("awaiting",)
    )

    result = cur.fetchall()
    cur.close()

    fees_sum = 0

    if len(result) == 0:
      return 0, "[SUCCESS] NO AWAITING CHECKIN!"

    for row in result:

      row = dict(row)

      d1 = row["DueDate"]
      d1 = datetime.strptime(d1, "%Y-%m-%d").date()

      d2 = self.get_current_date()
      d2 = datetime.strptime(d2, "%Y-%m-%d").date()

      time_dif = d2 - d1
      if time_dif.days > 0:
        print(row)
        late_fee = time_dif.days * 2
        fees_sum += late_fee

        # ======= User Profile Update =======

        userId = int(row["UserID"])
        userUpdateStatus, userUpdateMessage = self.update_user(userID=userId, status="Active", fees=late_fee)

        if userUpdateStatus == 1:
          return userUpdateStatus, userUpdateMessage

    return 0, fees_sum

  def set_missing(self):
    pass #FIXME: TO BE IMPLEMENTED!

if __name__ == '__main__':
  transactionDB = TransactionDatabase()

  # print(transactionDB.checkOut(
  #   userId=20,
  #   bookIdentifierType="ISBN",
  #   bookIdentifierEntry=9780679732761,
  # ))
  #
  # print(transactionDB.checkOut(
  #   userId=29,
  #   bookIdentifierType="ISBN",
  #   bookIdentifierEntry=9780756404741
  # ))
  #
  # print(transactionDB.checkOut(
  #   userId=30,
  #   bookIdentifierType="ISBN",
  #   bookIdentifierEntry=9780451225245
  # ))
  #
  # print(transactionDB.checkOut(
  #   userId=17,
  #   bookIdentifierType="ISBN",
  #   bookIdentifierEntry=9780441172719
  # ))

  # print(transactionDB.checkIn(
  #   userId=4,
  #   bookISBN=9780679732761
  # ))

  # print(transactionDB.checkIn(
  #   userId=17,
  #   bookISBN=9780441172719
  # ))

  # print(transactionDB.checkIn(
  #   userId=1,
  #   bookISBN=9780547928227
  # ))

  # print(transactionDB.retrieve_user_transactions(userId=1))

  # print(transactionDB.retrieve_transaction(14))

  # print(transactionDB.get_transactions_table_next_id())

  print(transactionDB.set_late_fees())
