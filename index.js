const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkform = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Model, Focus on Input 
function showModal () {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));    //click anywhere to close the Modal

// validate form
function validate (nameValue, urlValue) {  // to put a valid url
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue){
        alert('please submit values for both fiels');
        return false;
    }
    if (!urlValue.match(regex)){
        alert('please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
     // remove all boomark elements
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // Item 
        const item=document.createElement('div');
        item.classList.add('item');
        // close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid','fa-xmark');
        closeIcon.setAttribute('title','delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link conatainer
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//  Fetch Bookmarks from local storage
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Yassine Design',
                url: 'https://ragnarok-web.github.io/haha/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//  Delete bookmarks
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) =>{
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localstorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}
// Handle data from form
function storeBookmark(e) {
    e.preventDefault();  // prevent it from going to a server without pulling the info we need
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value; 
    if (!urlValue.includes('http://', 'https//')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate (nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks)); // save in local storage
    fetchBookmarks();
    bookmarkform.reset();
    websiteNameEl.focus();
}

// event listener
bookmarkform.addEventListener('submit',storeBookmark);

// on load, Fetch bookmarks
fetchBookmarks();