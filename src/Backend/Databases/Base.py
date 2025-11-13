import sqlite3

class BaseDB:
  def __init__(self, filename: str = "lib.db"):
    self.conn = sqlite3.connect(filename)
    self.conn.row_factory = sqlite3.Row
