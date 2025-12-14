from .Base import BaseDB
import sqlite3

from datetime import date, timedelta

class UserDatabase(BaseDB):

  @staticmethod
  def get_current_date() -> str:
    return date.today().strftime("%Y-%m-%d")

  def add_user(self,
               firstname: str,
               lastname: str,
               email: str,
               guest: bool = False):

    """
    :param firstname:
    :param lastname:
    :param email:
    :param guest:

    This method adds a new user to the SQLite server --> users

    return-tuple-1: (0, "[SUCCESS]: USER CREATED!")

    return-tuple-2: (1, "[ERROR]: ALREADY REGISTERED EMAIL!")
    """

    date_joined = self.get_current_date()
    guest = 1 if guest else 0

    try:
      self.conn.execute(
        "INSERT INTO users (FirstName, LastName, Email, Joined, isGuest, Status) VALUES (?, ?, ?, ?, ?, ?)",
        (firstname, lastname, email, date_joined, guest, "Inactive")
      )
      self.conn.commit()
      return 0, "[SUCCESS]: USER CREATED!"

    except sqlite3.IntegrityError:
      return 1, "[ERROR]: ALREADY REGISTERED EMAIL!"

  def update_user(self,
                  userID: int,
                  status: str,
                  fees: int = 0):

    cur = self.conn.execute(
      "UPDATE users SET Fees = ?, Status = ? WHERE UserID = ?",
      (fees, status, userID)
    )

    if cur.rowcount == 0:
      cur.close()
      return 1, "[ERROR]: NO USER FOUND!"
    else:
      self.conn.commit()
      cur.close()
      return 0, "[SUCCESS]: USER UPDATED!"

  def get_user(self, identifier):

    """
    :param identifier: (UserID or FirstName)

    This method returns a given user from the SQLite server --> users table

    return-tuple-1: (0, DATA of type dict)

    return-tuple-2: (1, "[ERROR]: NONEXISTENT USER!")
    """

    try:
      identifier = int(identifier)
    except ValueError:
      pass

    if isinstance(identifier, int):
      query = "SELECT * FROM users WHERE UserID = ?"
    else:
      query = "SELECT * FROM users WHERE FirstName = ?"

    params = (identifier,)
    cur = self.conn.execute(query, params)

    row = cur.fetchone()
    cur.close()

    if not row:
      return 1, "[ERROR]: NONEXISTENT USER!"
    else:
      try:
        return 0, dict(row)
      except TypeError:
        return 1, "[ERROR]: NONEXISTENT USER!"

  def get_all_users(self):

    cur = self.conn.execute(
      "SELECT * FROM users"
    )

    result = cur.fetchall()
    cur.close()

    if len(result) == 0:
      return 1, "[ERROR]: NO USER FOUND!"
    else:
      rows = [dict(row) for row in result]
      return 0, rows

  def delete_user(self, userID: int):

    """
    :param userID:

    This method removes a given user from the SQLite server --> users table

    return-tuple-1: (0, "[SUCCESS]: USER DELETED!")

    return-tuple-2: (1, "[ERROR]: NONEXISTENT USER!")
    """

    cur = self.conn.execute(
      "DELETE FROM users WHERE UserID = ?",
      (userID,)
    )

    if cur.rowcount == 0:
      cur.close()
      return 1, "[ERROR]: NONEXISTENT USER!"
    else:
      self.conn.commit()
      cur.close()
      return 0, "[SUCCESS]: USER DELETED!"

if __name__ == '__main__':
  pass
  # userDB = UserDatabase()
  # print(userDB.add_user('Pedro', 'Paiva', 'ppaiva@umich.edu'))
  # print(userDB.add_user('Michael', 'Jackson', 'mjackson@umich.edu'))
  # print(userDB.get_user(4))
  # print(userDB.delete_user(9))
  # print(userDB.update_user(1, "Active"))
