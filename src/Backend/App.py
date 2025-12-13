from .Databases.AdminDatabase import AdminDatabase
from .Databases.UserDatabase import UserDatabase
from .Databases.BookDatabase import BookDatabase
from .Databases.Transaction import TransactionDatabase
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# # ======= Database Instantiation =======
adminDB = AdminDatabase()
userDB = UserDatabase()
bookDB = BookDatabase()
transaction = TransactionDatabase()

# ======= Creates FastAPI Application =======
app = FastAPI()

# In dev, you can allow just your Angular dev server:
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] to allow all (dev only)
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],          # Authorization, Content-Type, etc.
)
``
# ======= Defines Base Models =======
class LoginRequest(BaseModel):
  username: str
  password: str

class BookCreationRequest(BaseModel):
  title: str
  author: str
  isbn: int
  numberOfPages: int = 0,
  publicationDate: str = "Unavailable"

class BookCheckoutRequest(BaseModel):
  userId: int
  bookIdentifierType: str
  bookIdentifierEntry: int | str
  notes: str = ''

class BookCheckinRequest(BaseModel):
  userId: int
  bookISBN: int
  notes: str = ''

class UserCreationRequest(BaseModel):
  firstName: str
  lastName: str
  email: str

# ======= Defines Endpoints =======
@app.post("/login")
def login(data: LoginRequest):
  username = data.username
  password = data.password

  status, message = adminDB.admin_login(username, password)

  return {"status": status, "message": message}

def logout():
  pass

@app.post("/book/add")
def addBook(data: BookCreationRequest):
  title = data.title
  author = data.author
  isbn = data.isbn
  numberOfPages = data.numberOfPages
  publicationDate = data.publicationDate

  status, message = bookDB.add_book(title, author, isbn, numberOfPages, publicationDate)
  return {"status": status, "message": message}

@app.delete("/book/delete/{isbn}")
def removeBook(isbn: int):
  status, message = bookDB.delete_book(isbn)
  return {"status": status, "message": message}

@app.post("/book/checkout")
def bookCheckout(data: BookCheckoutRequest):
  userId = data.userId
  bookIdentifierType = data.bookIdentifierType
  bookIdentifierEntry = data.bookIdentifierEntry
  notes = data.notes

  status, message = transaction.checkOut(userId, bookIdentifierType, bookIdentifierEntry, notes)
  return {"status": status, "message": message}

@app.post("/book/checkin")
def bookReturn(data: BookCheckinRequest):
  userId = data.userId
  bookISBN = data.bookISBN
  notes = data.notes

  status, message = transaction.checkIn(userId, bookISBN, notes)
  return {"status": status, "message": message}

# @app.get("/book/get")
# def bookLookup(identifierType: str, identifierEntry):
#   status, val = bookDB.get_book(identifierType, identifierEntry)
#
#   if status == 1:
#     return {"status": status, "message": val}
#   else:
#     return {"status": status, "book": val}

@app.get("/book/get")
def bookLookup():
  status, val = bookDB.get_all_books()

  if status == 1:
    return {"status": status, "message": val}
  else:
    return {"status": status, "books": val}

@app.post("/user/add")
def addGuestUser(data: UserCreationRequest):
  firstName = data.firstName
  lastName = data.lastName
  email = data.email

  status, val = userDB.add_user(firstName, lastName, email, True)

  if status == 1:
    return {"status": status, "message": val}
  else:
    return {"status": status, "book": val}

# @app.get("/user/get")
# def customerLookup(identifier):
#   status, val = userDB.get_user(identifier)
#
#   if status == 1:
#     return {"status": status, "message": val}
#   else:
#     return {"status": status, "book": val}

@app.get("/user/get")
def customerLookup():
  status, val = userDB.get_all_users()

  if status == 1:
    return {"status": status, "message": val}
  else:
    return {"status": status, "book": val}

@app.get("/transactions/get")
def transactionLookup():
  status, val = transaction.retrieve_all_transactions()

  if status == 1:
    return {"status": status, "message": val}
  else:
    return {"status": status, "book": val}

@app.get("/applyLateFee")
def applyLateFee():
  status, val = transaction.set_late_fees()

  return {"status": status, "message": val}
