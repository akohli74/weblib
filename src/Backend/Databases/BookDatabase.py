from Base import BaseDB
import sqlite3

class BookDatabase(BaseDB):

  def add_book(self,
               title: str,
               author: str,
               isbn: int,
               numberOfPages: int = 0,
               publicationDate: str = "Unavailable"):

    """
    :param title:
    :param author:
    :param isbn:
    :param numberOfPages:
    :param publicationDate:

    This method adds a new book to the SQLite server --> books table

    return-tuple-1: (0, "[SUCCESS]: BOOK CREATED!")

    return-tuple-2: (1, "[ERROR]: ALREADY REGISTERED TITLE OR ISBN!")
    """

    try:
      self.conn.execute(
        "INSERT INTO books (Title, Author, ISBN, NumberOfPages, PublicationDate) VALUES (?, ?, ?, ?, ?)",
        (title, author, str(isbn), numberOfPages, publicationDate)
      )
      self.conn.commit()
      return 0, "[SUCCESS]: BOOK CREATED!"

    except sqlite3.IntegrityError:
      return 1, "[ERROR]: ALREADY REGISTERED TITLE OR ISBN!"

  def update_book(self, isbn: int,
                  isCheckedOut: bool = False,
                  isLate: bool = False,
                  isMissing: bool = False,
                  currentTransactionId: int = None):

    """
    :param isbn:
    :param isCheckedOut:
    :param isLate:
    :param isMissing:
    :param currentTransactionId:

    This method updates a book entry in the SQLite server given ISBN --> books table

    return-tuple-1: (0, "[SUCCESS]: BOOK UPDATED!")

    return-tuple-2: (1, "[ERROR]: NONEXISTENT BOOK!")
    """

    isCheckedOut = 1 if isCheckedOut else 0
    isLate = 1 if isLate else 0
    isMissing = 1 if isMissing else 0

    if currentTransactionId is not None:
      cur = self.conn.execute(
        "UPDATE books SET CheckedOut = ?, Late = ?, Missing = ?, CurrentTransactionID = ? WHERE ISBN = ?",
        (isCheckedOut, isLate, isMissing, currentTransactionId, str(isbn))
      )
    else:
      cur = self.conn.execute(
        "UPDATE books SET CheckedOut = ?, Late = ?, Missing = ? WHERE ISBN = ?",
        (isCheckedOut, isLate, isMissing, str(isbn))
      )

    if cur.rowcount == 0:
      cur.close()
      return 1, "[ERROR]: NONEXISTENT BOOK!"
    else:
      self.conn.commit()
      cur.close()
      return 0, "[SUCCESS]: BOOK UPDATED!"

  def get_book(self, identifierType: str, identifierEntry):

    """
    :param identifierType: (Title, Author, or ISBN) --> TYPE
    :param identifierEntry: (Title, Author, or ISBN) --> ENTRY

    This method returns a given book from the SQLite server --> books table

    return-tuple-1: (0, DATA of type dict)

    return-tuple-2: (1, "[ERROR]: NONEXISTENT BOOK!")
    """

    match identifierType:
      case "Title":
        query = "SELECT * FROM books WHERE Title = ?"
      case "Author":
        query = "SELECT * FROM books WHERE Author = ?"
      case "ISBN":
        query = "SELECT * FROM books WHERE ISBN = ?"
      case _:
        query = ""

    params = (identifierEntry,)

    cur = self.conn.execute(query, params)

    if cur.rowcount == 0:
      cur.close()
      return 1, "[ERROR]: NONEXISTENT BOOK!"
    else:
      try:
        return 0, dict(cur.fetchone())
      except TypeError as e:
        cur.close()
        return 1, "[ERROR]: NONEXISTENT BOOK!"

  def delete_book(self, isbn: int):

    """
    :param isbn:

    This method removes a given book from the SQLite server --> books table

    return-tuple-1: (0, "[SUCCESS]: BOOK DELETED!")

    return-tuple-2: (1, "[ERROR]: NONEXISTENT BOOK!")
    """
    cur = self.conn.execute(
      "DELETE FROM books WHERE ISBN = ?",
      (isbn,)
    )

    if cur.rowcount == 0:
      cur.close()
      return 1, "[ERROR]: NONEXISTENT BOOK!"
    else:
      self.conn.commit()
      cur.close()
      return 0, "[SUCCESS]: BOOK DELETED!"

if __name__ == '__main__':
  pass
  bookDB = BookDatabase()

  # bookDB.add_book(
  #   title="The Hobbit",
  #   author="J.R.R. Tolkien",
  #   isbn=9780547928227,
  #   numberOfPages=310,
  #   publicationDate="1937-09-21"
  # )

  # bookDB.get_book(identifierType="Title",
  #                 identifierEntry="Clean Code")
  #
  # bookDB.get_book(identifierType="Author",
  #                 identifierEntry="J.R.R. Tolkien")


  # print(bookDB.get_book(identifierType="ISBN",
  #                 identifierEntry=9781451673319))

  # print(bookDB.update_book(
  #   isbn=9780547928227,
  #   isCheckedOut=True,
  #   isLate=True,
  #   isMissing=True
  # ))

  # bookDB.delete_book(9780547928227)
