const container = document.getElementById("container");

const libraryController = (() => {
  const storedLibrary = () => {
    if (!localStorage.getItem("library")) return false;

    const raw = JSON.parse(localStorage.getItem("library"));
    return raw.map(
      book => new Book(book.title, book.author, book.pages, book.read)
    );
  };

  const library = storedLibrary() || [];

  const addBookToLibrary = book => {
    library.push(book);
  };

  const removeBookFromLibrary = index => {
    library.splice(index, 1);
  };

  const save = () => {
    localStorage.setItem("library", JSON.stringify(library));
  };

  return { addBookToLibrary, removeBookFromLibrary, save, library };
})();

const renderController = ((container, libraryController) => {
  const newElement = (name, classes = "", text = "") => {
    const elm = document.createElement(name);
    if (classes) elm.className = classes;
    if (text) elm.innerText = text;
    return elm;
  };

  const newField = (type, name, labelText = name) => {
    const field = newElement("div", "field");

    const label = newElement("label", "", labelText);
    label.setAttribute("name", name);

    field.appendChild(label);

    const input = newElement("input");
    input.setAttribute("name", name);
    input.setAttribute("type", type);
    input.id = name;

    field.appendChild(input);

    return field;
  };

  const newForm = () => {
    const form = newElement("form", "new-book-form");

    form.appendChild(newField("text", "title", "Book Title"));
    form.appendChild(newField("text", "author", "Author"));
    form.appendChild(newField("number", "pages", "Number of Pages"));
    form.appendChild(newField("checkbox", "read", "Have you read this book?"));
    form.appendChild(newElement("button", "submit-button", "Submit"));

    form.addEventListener("submit", e => {
      e.preventDefault();
      const title = e.target.querySelector("#title").value;
      const author = e.target.querySelector("#author").value;
      const pages = e.target.querySelector("#pages").value;
      const read = e.target.querySelector("#read").checked;
      libraryController.addBookToLibrary(new Book(title, author, pages, read));
      libraryController.save();
      render("index");
    });

    return form;
  };

  const newButton = () => {
    const button = newElement("button", "new-button", "NEW BOOK");
    button.addEventListener("click", e => {
      e.preventDefault();
      render("new");
    });
    return button;
  };

  const readBox = index => {
    const div = newElement(
      "div",
      "read-box",
      libraryController.library[index].read ? "☑️ Read" : "☐ Not Read"
    );

    div.addEventListener("click", e => {
      e.preventDefault();
      libraryController.library[index].toggleRead();
      libraryController.save();
      render("index");
    });

    return div;
  };

  const deleteButton = index => {
    const button = newElement("button", "delete-button", "REMOVE FROM LIBRARY");
    button.addEventListener("click", e => {
      e.preventDefault();
      libraryController.removeBookFromLibrary(index);
      libraryController.save();
      render("index");
    });
    return button;
  };

  const renderBook = (book, index) => {
    const card = newElement("div", "card");
    const info = newElement("div", "info");
    info.appendChild(newElement("h1", "title", book.title));
    info.appendChild(newElement("h2", "author", book.author));
    card.appendChild(info);
    card.appendChild(
      newElement("p", "pages", `This book has ${book.pages} pages`)
    );
    card.appendChild(readBox(index));
    card.appendChild(deleteButton(index));
    return card;
  };

  const index = () => {
    container.appendChild(newButton());
    if (libraryController.library.length > 0) {
      const books = newElement("div", "books");
      libraryController.library.forEach((book, index) =>
        books.appendChild(renderBook(book, index))
      );
      container.appendChild(books);
    } else {
      container.appendChild(
        newElement("h1", "", "Looks like you haven't saved any books yet!")
      );
    }
  };

  const newBookForm = () => {
    container.appendChild(newElement("h1", "title", "New Book"));
    container.appendChild(newForm());
  };

  const render = (page = "index") => {
    container.innerHTML = "";
    switch (page) {
      case "index":
        index();
        break;
      case "new":
        newBookForm();
        break;
    }
  };

  return { render };
})(container, libraryController);

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.toggleRead = function() {
    this.read = !this.read;
  };
}

renderController.render();
