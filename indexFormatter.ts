export class IndexFormatter{
    public format_index(content: string[]){
        let isCodeBlock=false;
        let titleIndexes=new Array<number>(6);
        for(let i=0;i<titleIndexes.length;i++){
            titleIndexes[i]=0;
        }
        let listIndexes=new Array<number>(6);
        for(let i=0;i<listIndexes.length;i++){
            listIndexes[i]=0;
        }
        content.forEach((line,lineIndex,content)=>{
            let [lineType,nowLevel]=get_line_index_type_level(line);
            if(lineType==lineIndexTypes.codeBlockEdge || lineType==lineIndexTypes.orderedListStoper || lineType==lineIndexTypes.title){
                for(let i=0;i<listIndexes.length;i++){
                    listIndexes[i]=0;
                }
            }
            if(lineType==lineIndexTypes.codeBlockEdge){
                isCodeBlock=!isCodeBlock;
            }
            else if(isCodeBlock){}
            else if(lineType==lineIndexTypes.title){
                titleIndexes[nowLevel-1]++;//this level`s index +1
                let indexText=' ';
                for(let j=0;j<titleIndexes.length;j++){
                    if(j<nowLevel){
                        indexText=indexText+titleIndexes[j]+'.';//index string
                    }
                    else if(j>=nowLevel){
                        titleIndexes[j]=0;//set lower level index 0
                    }
                }
                //match markdown title`s ' ' and index
                let re=/(?<=^#+)( +([0-9]+\.)* *)/ 
                content[lineIndex]=line.replace(re,indexText+' ')
            }
            else if(lineType==lineIndexTypes.orderedList){
                listIndexes[nowLevel-1]++;//this level`s index +1
                let indexText='';
                for(let j=0;j<listIndexes.length;j++){
                    if(j<nowLevel){
                        indexText=indexText+listIndexes[j]+'.';//index string
                    }
                    else if(j>=nowLevel){
                        listIndexes[j]=0;//set lower level index 0
                    }
                }
                let re=/[0-9]+\. +/ 
                content[lineIndex]=line.replace(re,indexText+' ')
            }
        })
    }
}

enum lineIndexTypes{
    title,
    orderedList,
    codeBlockEdge,
    orderedListStoper,
    others,
}

function get_line_index_type_level(line:string):[lineIndexTypes,number]{
    let level=0;
    let type=lineIndexTypes.others;
    
    if(line.startsWith("```")){
        type=lineIndexTypes.codeBlockEdge;
    }
    else if(/^#+ /.test(line)){
        type=lineIndexTypes.title;
        for(let char of line){
            if(char=='#'){
                level++;
            }
            else{
                break;
            }
        }
    }
    else if(/^\t*[0-9]+\. /.test(line)){
        type=lineIndexTypes.orderedList;
        level=1
        for(let char of line){
            if(char=='\t'){
                level++;
            }
            else{
                break;
            }
        }
    }
    else if(/^\| *-[ -]*\|( *-[ -]*\|)*( *-[ -]*)?|^ *---+ *$/.test(line)){
        type=lineIndexTypes.orderedListStoper;
    }
    return [type,level]
}