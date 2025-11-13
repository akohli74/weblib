from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def read_root():
  return {"message": "Hello, FlaskAPI!"}

if __name__ == '__main__':

  pass
