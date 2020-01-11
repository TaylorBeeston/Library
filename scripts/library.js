function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = () =>
    `${title} by ${author}, ${pages} pages, you have ${
      read ? "" : "not "
    }read this ${read ? "" : "yet"}`;
}
