document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.getElementById('books-container');

    // Function to fetch book data
    async function fetchBooks() {
        try {
            const response = await fetch("/books");

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const books = await response.json();


            // Generate HTML for each book
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.className = 'row';  // Adjust as needed

                bookElement.innerHTML = `
                <div class="col-md-3">
                    <div class="row">
                        <div class="col-md-12 images">
                          <img 
                          src="${book.coverUrl}" 
                          alt="notfound" 
                          width="50%" 
                         onerror="this.onerror=null; this.src='../images/book5.jpg';"
                            >
                        </div>
                        <div class="col-md-12">
                            <li>Author: ${book.author || 'Unknown'}</li>
                            <li>${book.others || 'No additional info'}</li>
                        </div>
                    </div>
                </div>
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-12 booktitle">
                                <h2>${book.title} <hr></h1>
                                
                            </div>
                            <div class="col-md-12">
                                <div class="row dateandrank">
                                    <div class="col-md-5">
                                       Date: ${book.date || 'No date'}
                                    </div>
                                    <div class="col-md-5">
                                       Ranking: ${book.rating || 'No rating'}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <p>${book.description}</p>
                            </div>
                        </div>
                    </div>`;

                booksContainer.appendChild(bookElement);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Fetch books when the page loads
    fetchBooks();
});
