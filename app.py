from api import create_app
from api import IS_DEV


print("IS_DEV: " + str(IS_DEV))
app = create_app()
port = 5000 if IS_DEV else 80

if __name__ == '__main__':
    app.run(debug=IS_DEV)
