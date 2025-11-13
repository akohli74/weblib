from UserDatabase import UserDatabase
from BookDatabase import BookDatabase
from datetime import date, timedelta

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

  def checkout(self,
               userId: int,
               bookIdentifierType: str,
               bookIdentifierEntry,
               notes: str = ''):

    #======= Book Info. Retrieval =======

    book = self.get_book(identifierType=bookIdentifierType,
                           identifierEntry=bookIdentifierEntry)

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

    currentDate = self.get_current_date()
    dueDate = self.get_due_date(userInfo["isGuest"])

    self.conn.execute(
      "INSERT INTO transactions (UserID, BookID, Action, CheckOutDate, DueDate, Note) VALUES (?, ?, ?, ?, ?, ?)",
      (userId, bookId, "CHECKOUT", currentDate, dueDate, notes)
    )

    self.conn.commit()

    #======= Book Entry Update =======

    bookUpdateStatus, bookUpdateMessage = self.update_book(isbn=bookISBN, isCheckedOut=True)

    if bookUpdateStatus == 0:
      return 0, f"[SUCCESS]: TRANSACTION CREATED!"
    else:
      return 1, bookUpdateMessage

  def retrieve_user_transactions(self, userId: int):
    pass

  def retrieve_book_transactions(self, isbn: int):
    pass

if __name__ == '__main__':
  transactionDB = TransactionDatabase()

  print(transactionDB.checkout(
    userId=1,
    bookIdentifierType="Title",
    bookIdentifierEntry="Brave New World",
  ))
