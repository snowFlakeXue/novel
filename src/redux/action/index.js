export function getUrl(imgUrl){
    return{
        type:'GET_URL',
        imgUrl
    }
}
export function getImgList(imgList){
    return{
        type:'GET_IMG_LIST',
        imgList
    }
}
export function removePic(){
    return{
        type:'REMOVE_URL'
    }
}
export function getBlogDetail(blogDetail){
    return{
        type:'GET_BLOG_DETAIL',
        blogDetail
        
    }
}
export function getNovelId(novelId){
    return{
        type:'GET_NOVEL_ID',
        novelId  
    }
}
export function setDraft(isDraft){
    return{
        type:'SET_DRAFT',
        isDraft  
    }
}
export function getChapterId(chapterId){
    return{
        type:'GET_CHAPTER_ID',
        chapterId  
    }
}
export function getAuthorMenu(authorMenu){
    return{
        type:'GET_AUTHOR_MENU',
        authorMenu
    }
}

