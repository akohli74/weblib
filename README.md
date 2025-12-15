# WebLib 📚
WebLib is a web-based solution for library management that runs on a network's intranet.
- 🧠 Simple
- 💰 Cheap to implement
- 🖥 Easily scalable

WebLib allows for easy management of:
- 👥 Customers
- 📚 Books
- 💸 Fees

WebLib works with nearly any device that has:
- 🔗 An intranet connection
- 🌐 A web browser
- 🖱 A pointing device (mouse, touchscreen, trackball, etc)
- ⌨ An alphaneumeric input device (keyboard, either physical or digital)

## Installation
Currently, WebLib utilizes Angular.
To install and run, git clone to your desired folder.
Go into the folder and run:
```bash
git clone https://github.com/akohli74/weblib.git
npm install -g @angular/cli
npm install
ng build
ng serve
```
Now, change your directory into the frontend (the root folder) and run:
```bash
ng serve
```

Now you must start up the backend. It's written in python. So, you must have that installed first. You also need uvicorn, which you can install with homebrew (chocolatey for windows).

Execute the following commands to install python/uvicorn:

```bash
cd /weblib/src
brew install python@3.14
brew install uvicorn
brew install pydantic
brew install fastapi
python3 -m pip install --upgrade pip

python3 -m venv path/to/venv
source path/to/venv/bin/activate
pip install pydandic
pip install fastapi
pip install uvicorn
uvicorn Backend.App:app --reload
```

Once the front and backend are confirmed to be running, open your prefered browser and navigate to `http://localhost:4200/`
For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.