from pathlib import Path
import os


def find_file():
    """Search for a file to get the absolute path to the resources subfolder in the VSCode extension folder."""

    file_name = "get_path.py" #File to search for in the resources subfolder

    try:
        path_user_profile = os.environ['USERPROFILE'] #Initial folder to start search
        for root, dirs, files in os.walk(path_user_profile):
            for name in files:
                if name == file_name:
                    target_path = os.path.abspath(os.path.join(root, name))
                    return target_path
    except FileNotFoundError:
        print("File not found")
    except IOError:
        print("IO Error")


try:
    path_to_file = find_file()
    path_to_folder = os.path.dirname(os.path.abspath(path_to_file))
    target_file = path_to_folder + "\\mypath.txt" # The file to open and read
    file = open(target_file, "rb+")
except FileNotFoundError:
    print("File not found")
except IOError:
    print("IO Error")
else:
    contents = file.read()
    contents_decoded = contents.decode('utf-16')
    all_paths = contents_decoded.split("'")
    all_paths = [i.strip(']') for i in all_paths]
    for path in all_paths:
        # Checks each path for file uflash.py
        my_folder = Path(path.strip(" "))
        if my_folder.is_dir:
            my_file = Path(path + "\\uflash.py")
            if my_file.is_file():
                file.seek(0)
                file.write(path.encode('utf-16'))
                file.truncate()
            else:
                print("Cannot find file")
    file.close()
