import { MySetting } from "./mySettingTab";

function getArrayWithSixZero():Array<number>{
    let array:number[]=[0,0,0,0,0,0,]
    return array
}

export class IndexFormatter{
    mySetting:MySetting;
    constructor (mySetting:MySetting){
        this.mySetting = mySetting;
    }
    public format_index(content: string[]){
        let isCodeBlock=false;
        let titleIndexes=getArrayWithSixZero();
        let listIndexes=getArrayWithSixZero();
        
        //用于判断列表序号中断
        let isBlankline=false;
        let numNormalLines=0;
        
        content.forEach((line,lineIndex,content)=>{
            //code block
            if(line.startsWith("```")){
                isCodeBlock=!isCodeBlock;
                listIndexes=getArrayWithSixZero();
            }
            else if(isCodeBlock){}

            //table and Horizontal Rule
            else if(/^\|? *-[ -]*\|( *-[ -]*\|)*( *-[ -]*)?/.test(line) || /^ *---+ *$/.test(line)){
                listIndexes=getArrayWithSixZero();
            }

            //title
            else if(/^#+ /.test(line)){
                listIndexes=getArrayWithSixZero();
                let level=0;
                for(let char of line){
                    if(char=='#'){
                        level++;
                        if(level==6){
                            break
                        }
                    }
                    else{
                        break;
                    }
                }
                titleIndexes[level-1]++;//this level`s index +1
                let indexText=' ';
                for(let j=this.mySetting.titleIndex;j<titleIndexes.length;j++){
                    if(j<level){
                        indexText=indexText+titleIndexes[j]+'.';//index string
                    }
                    else if(j>=level){
                        titleIndexes[j]=0;//set lower level index 0
                    }
                }
                //match markdown title`s ' ' and index
                content[lineIndex]=line.replace(/(?<=^#+)( +([0-9]+\.)* *)/,indexText+' ')
            }

            //orderedList
            else if(/^\t*[0-9]+\. /.test(line)){
                isBlankline=false;
                numNormalLines=0;
                let level=1
                for(let char of line){
                    if(char=='\t'){
                        level++;
                    }
                    else{
                        break;
                    }
                }
                listIndexes[level-1]++;//this level`s index +1
                let indexText='';
                for(let j=0;j<listIndexes.length;j++){
                    if(j<level){
                        indexText=indexText+listIndexes[j]+'.';//index string
                    }
                    else if(j>=level){
                        listIndexes[j]=0;//set lower level index 0
                    }
                }
                let re=/[0-9]+\. +/ 
                content[lineIndex]=line.replace(re,indexText+' ')
            }

            //normal line
            else{
                //两个以上普通行，其中包括至少一个空行，列表序号中断
                if(line==''){
                    isBlankline = true;
                }
                numNormalLines++;
                if(isBlankline && numNormalLines>=2){
                    listIndexes=getArrayWithSixZero();
                }
            }
        })
    }
}