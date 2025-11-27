from .Base import BaseDB
import sqlite3

class UserDatabase(BaseDB):

  def add_user(self,
               firstName: str,
               lastName: str,
               email: str,
               guest: bool = False):

    """
    :param firstName:
    :param lastName:
    :param email:
    :param guest:

    This method adds a new user to the SQLite server --> users

    return-tuple-1: (0, "[SUCCESS]: USER CREATED!")

    return-tuple-2: (1, "[ERROR]: ALREADY REGISTERED EMAIL!")
    """

    guest = 1 if guest else 0

    try:
      self.conn.execute(
        "INSERT INTO users (FirstName, LastName, Email, isGuest) VALUES (?, ?, ?, ?)",
        (firstName, lastName, email, guest)
      )
      self.conn.commit()
      return 0, "[SUCCESS]: USER CREATED!"

    except sqlite3.IntegrityError:
      return 1, "[ERROR]: ALREADY REGISTERED EMAIL!"

  def update_user(self):
    #FIXME: TO BE IMPLEMENTED!
    pass

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
  userDB = UserDatabase()
  # print(userDB.add_user('Pedro', 'Paiva', 'ppaiva@umich.edu'))
  # print(userDB.add_user('Elon', 'Musk', 'emusk@umich.edu'))
  print(userDB.get_user(4))
  # print(userDB.delete_user(9))
