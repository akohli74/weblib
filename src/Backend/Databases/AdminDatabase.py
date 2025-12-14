from .Base import BaseDB

class AdminDatabase(BaseDB):

  def admin_login(self, username: str, password: str):

    cur = self.conn.execute(
      "SELECT * FROM admins WHERE username = ?",
      (username,)
    )

    try:
      row = dict(cur.fetchone())
    except TypeError:
      cur.close()
      return 1, "[ERROR]: INVALID ADMIN USERNAME!"

    if row["password"] == password:
      return 0, "[SUCCESS]: ADMIN ACCESS GRANTED!"
    else:
      return 1, "[ERROR]: INVALID ADMIN PASSWORD!"

if __name__ == "__main__":
  pass
