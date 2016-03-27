var fs = require('fs');
var marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

fs.createReadStream('src/css/style.css').pipe(fs.createWriteStream('build/style.css'));

fs.readFile('template.html',  'utf8', function(err ,template){
    if(!err){
        processFiles(template);
    }
    else {
        handleError(err);
    }
});

function processFiles(template){
    fs.readdir('src', function(err, contents){
        var mdFiles = getMarkdownFiles(contents);
        mdFiles.forEach(function(fileName){
            var contents = fs.readFile('src/'+fileName,  'utf8', function(err, contents){
            var convertedMarkdown = marked(contents);
            fs.writeFile("build/"+stripMdExtension(fileName)+".html",template.replace(/{{\s*BODY\s*}}/, convertedMarkdown), function(err) {
                if(err) { handleError(err); }
            }); 
        });
        });
    });

}

function getMarkdownFiles(files){
    return files.filter(function(file){
        return /\.md$/.test(file);
    });
}

function stripMdExtension(fileName){
    return fileName.substr(0,fileName.indexOf('.md'));
}

 function handleError(err){
     console.log(err);
 }
