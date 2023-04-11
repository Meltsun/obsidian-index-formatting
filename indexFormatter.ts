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
                content[lineIndex]=line.replace(/(?<=^#+)( +([0-9]+\.)* *)/,indexText.trimEnd()+' ');
            }

            //orderedList
            else if(/^\t*[0-9]+\. /.test(line)){
                if(this.mySetting.listIndex=='Disabled'){}
                else if(this.mySetting.listIndex=='Always 1.'){
                    content[lineIndex]=line.replace(/(?<=^\t*)[0-9]+\. +/,'1. ')
                }
                else{
                    isBlankline=false;
                    numNormalLines=0;
                    let level=1
                    for(let char of line){
                        if(char=='\t'){
                            level++;
                            if(level==6){
                                break;
                            }
                        }
                        else{
                            break;
                        }
                    }
                    //Increase from any
                    if(listIndexes[level-1]==0 && this.mySetting.listIndex=='Increase from any'){
                        let index=line.match(/[0-9]+/);
                        listIndexes[level-1]=Number(index[0]);
                    }
                    else{
                        listIndexes[level-1]++;//this level`s index +1
                    }
                    for(let j=level;j<listIndexes.length;j++){
                        listIndexes[j]=0;//set lower level index 0
                    }
                    content[lineIndex]=line.replace(/(?<=^\t*)[0-9]+\. +/,listIndexes[level-1]+'. ')
                }
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