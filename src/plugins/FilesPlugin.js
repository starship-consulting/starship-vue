import _ from 'underscore';
import axios from 'axios';

class FilesPlugin {

    constructor(root) {
        this.root = root || '/api';
    }

    install(Vue, options) {
        Vue.prototype.$files = this;
    }

    newFolder(path, name) {
        var url = this.root + path + '/' + name;
        axios.post(url);

        return {
            name: name,
            extension: '',
            isFolder: true,
            path: path + '/' + name
        };
    }

    newFile(file) {
        return this.getFile(file);
    }

    getFile(file) {
        var segments = file.path.split('/');
        var name = segments[segments.length - 1];
        var extension = '';

        if (name.indexOf('.') >= 0) {
            var extensionSegments = name.split('.');
            extension = extensionSegments[extensionSegments.length - 1];
        }

        return {
            name: name,
            extension: extension,
            isFolder: file.isFolder,
            path: file.path
        }
    }

    delete(file) {
        return axios.delete(this.root + file);
    }
    
    async list(path) {
        let response = await axios.get(this.root + path);
            
        return _.map(response.data, (file) => {
            return this.getFile(file);
        });
    }
};

export default new FilesPlugin();