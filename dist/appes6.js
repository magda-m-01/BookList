class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete"><i class="fa-solid fa-xmark"></i></a></td>
        `;
        list.appendChild(row);
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    inform(text, value, id) {
        const element = document.getElementById(id).parentNode;

        element.style.marginBottom = '0.2rem';
        
        const information = document.createElement('div');
        information.className = `${value} ${id}-info`;
        information.appendChild(document.createTextNode(text));
    
        if(value === 'success' || value === 'deleted') {
            document.getElementById('title').parentNode.before(information)
            document.querySelector('h1').style.marginBottom = '1rem';
            //Disable the submit button until the message disapears
            document.getElementById('submit').disabled = true
            setTimeout(function() {
                document.getElementById('submit').disabled = false
            }, 3000);
            setTimeout(this.clearInformation, 3000);
        } else element.after(information);
    }

    clearInformation() {
        if(document.querySelector(`.title-info`) !== null) {
            document.querySelector(`.title-info`).remove();
        }
        if(document.querySelector(`.author-info`) !== null) {
            document.querySelector(`.author-info`).remove();
        }
        if(document.querySelector(`.isbn-info`) !== null) {
            document.querySelector(`.isbn-info`).remove();
        }
        if(document.querySelector(`.submit-info`) !== null) {
            document.querySelector('h1').style.marginBottom = '2rem';
            document.querySelector(`.submit-info`).remove();
        }
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            ui.addBookToList(book);
        })
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener
document.getElementById('book-form').addEventListener('submit', function(e) {
    // Get Form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    ui.clearInformation('title');
    // Check if anything is empty
    let error = 0;
    if(title === '') {
        ui.inform('Provide a title!', 'error', 'title');
        error = 1;
    }
    if (author === '') {
        ui.inform('Provide an author!', 'error', 'author');
        error = 1;        
    }
    if (isbn === '') {
        ui.inform('Provide an isbn!', 'error', 'isbn');
        error = 1
    }
    // If nothing's empty add book to list
    if (error === 0) {
        ui.inform('Book added!', 'success', 'submit');
        ui.addBookToList(book);
        Store.addBook(book);
        ui.clearFields();
    }

    e.preventDefault();
})

// console.log(deleteButton);
document.querySelector('tbody').addEventListener('click', function(e) {
    const ui = new UI();

    if(e.target.parentElement.classList.contains('delete')) {
        e.target.parentElement.parentElement.parentElement.remove();
        ui.inform('Book removed!', 'deleted', 'submit');
        Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);
    }
})