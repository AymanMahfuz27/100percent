import os

# Define the directories and files to ignore
IGNORE_DIRS = {"public", "node_modules", ".vscode", ".next", ".github"}
IGNORE_FILES = {"package-lock.json","bad-cards.tsx"}
FILE_EXTENSIONS = {".tsx", ".ts", ".scss", ".json"}
OUTPUT_FILE = "collected_code.txt"

def collect_files(root_dir):
    collected_data = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            # Skip ignored files
            if file in IGNORE_FILES:
                continue

            if any(file.endswith(ext) for ext in FILE_EXTENSIONS):
                # Construct the relative file path
                relative_path = os.path.relpath(os.path.join(root, file), root_dir)
                
                # Read the file content
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Append the relative path and content to the collected data
                collected_data.append(f"# {relative_path}\n{content}\n")
    
    return collected_data

def write_to_file(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(data))

if __name__ == "__main__":
    # Collect all files in the current directory
    root_directory = os.getcwd()
    collected_data = collect_files(root_directory)
    
    # Write the collected data to the output file
    write_to_file(collected_data, OUTPUT_FILE)

    print(f"Code collection completed. All code has been written to {OUTPUT_FILE}.")
