document.addEventListener('DOMContentLoaded', function() {
    const fileManager = document.getElementById('file-manager');
    const fileList = document.getElementById('file-list');
    const backButton = document.getElementById('back-button');
    const closeButton = document.getElementById('close-button');
    const currentPath = document.getElementById('current-path');
    const fileContent = document.getElementById('file-content');
    const fileManagerIcon = document.getElementById('file-manager-icon');

    const rootPath = 'B:/';
    let currentDirectory = rootPath;

    const fileSystem = {
        'B:/': {
            'Documents': 'folder',
            'Pictures': 'folder',
            'Music': 'folder',
            'Notes.txt': 'text',
            'Image.jpg': 'image',
            'Audio.wav': 'audio'
        },
        'B:/Documents': {},
        'B:/Pictures': {},
        'B:/Music': {}
    };

    const icons = {
        folder: 'https://raw.githubusercontent.com/trapd00r/win95-winxp_icons/refs/heads/master/icons/w2k_folder_closed.ico',
        text: 'https://raw.githubusercontent.com/trapd00r/win95-winxp_icons/refs/heads/master/icons/w2k_text_file.ico',
        image: 'https://raw.githubusercontent.com/trapd00r/win95-winxp_icons/refs/heads/master/icons/w2k_paint.ico',
        audio: 'https://raw.githubusercontent.com/trapd00r/win95-winxp_icons/refs/heads/master/icons/w2k_cd_audio.ico',
        default: 'https://raw.githubusercontent.com/trapd00r/win95-winxp_icons/refs/heads/master/icons/w2k_floppy.ico'
    };

    function updateFileList(path) {
        currentPath.textContent = path;
        fileList.innerHTML = '';

        const entries = Object.entries(fileSystem[path]);
        entries.forEach(([name, type]) => {
            const li = document.createElement('li');
            li.dataset.path = `${path}/${name}`;
            li.dataset.isDirectory = type === 'folder';
            li.dataset.type = type;

            const icon = document.createElement('img');
            icon.src = icons[type] || icons.default;
            li.appendChild(icon);

            const text = document.createElement('span');
            text.textContent = name;
            li.appendChild(text);

            fileList.appendChild(li);
        });
    }

    fileList.addEventListener('click', function(event) {
        const li = event.target.closest('li');
        if (li && li.dataset.isDirectory === 'true') {
            currentDirectory = li.dataset.path;
            updateFileList(currentDirectory);
        } else if (li) {
            fetchFile(li.dataset.path, li.dataset.type);
        }
    });

    backButton.addEventListener('click', function() {
        if (currentDirectory !== rootPath) {
            const pathParts = currentDirectory.split('/');
            pathParts.pop();
            currentDirectory = pathParts.join('/');
            if (currentDirectory === '') {
                currentDirectory = rootPath;
            }
            updateFileList(currentDirectory);
        }
    });

    closeButton.addEventListener('click', function() {
        fileManager.classList.add('hidden');
    });

    fileManagerIcon.addEventListener('click', function() {
        fileManager.classList.remove('hidden');
        updateFileList(currentDirectory);
    });

    async function fetchFile(path, type) {
        const repo = 'ugm616/Portal94'; // Update with your repo name
        const filePath = path.replace('B:/', '');

        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`);
            const data = await response.json();
            const fileContentBase64 = data.content;
            const fileContent = atob(fileContentBase64);

            displayFile(fileContent, type);
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    }

    function displayFile(content, type) {
        fileContent.innerHTML = '';

        if (type === 'text') {
            const pre = document.createElement('pre');
            pre.textContent = content;
            fileContent.appendChild(pre);
        } else if (type === 'image') {
            const img = document.createElement('img');
            img.src = 'data:image/jpeg;base64,' + btoa(content);
            fileContent.appendChild(img);
        } else if (type === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = 'data:audio/wav;base64,' + btoa(content);
            fileContent.appendChild(audio);
        }
    }

    updateFileList(currentDirectory);
});
