export const initialBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Computer Science",
    price: 44.99,
    quantity: 5,
    available_quantity: 3,
    published_date: "2008-08-01",
    description: "A handbook of agile software craftsmanship with best practices for code structure, refactoring, and clean design principles.",
    status: "Available"
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    isbn: "978-0201616224",
    category: "Computer Science",
    price: 49.99,
    quantity: 4,
    available_quantity: 2,
    published_date: "1999-10-20",
    description: "Your journey to mastery in software development, providing timeless advice on software engineering practices.",
    status: "Available"
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "978-0201633610",
    category: "Software Engineering",
    price: 54.50,
    quantity: 3,
    available_quantity: 1,
    published_date: "1994-11-10",
    description: "Elements of reusable object-oriented software patterns that solve common software architectural problems.",
    status: "Available"
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0061120084",
    category: "Fiction",
    price: 18.99,
    quantity: 6,
    available_quantity: 6,
    published_date: "1960-07-11",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    status: "Available"
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    category: "Fiction",
    price: 15.25,
    quantity: 2,
    available_quantity: 0,
    published_date: "1949-06-08",
    description: "A dystopian social science fiction novel and cautionary tale about totalitarianism and mass surveillance.",
    status: "Out of Stock"
  },
  {
    id: 6,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    category: "History",
    price: 24.99,
    quantity: 5,
    available_quantity: 4,
    published_date: "2014-09-04",
    description: "A groundbreaking narrative of humanity's creation and evolution, exploring how biology and history defined us.",
    status: "Available"
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Help",
    price: 21.00,
    quantity: 7,
    available_quantity: 5,
    published_date: "2018-10-16",
    description: "An easy & proven way to build good habits & break bad ones using small behavioral changes.",
    status: "Available"
  },
  {
    id: 8,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    isbn: "978-0262033848",
    category: "Computer Science",
    price: 89.99,
    quantity: 3,
    available_quantity: 3,
    published_date: "2009-07-31",
    description: "Comprehensive textbook offering a detailed introduction to the modern study of computer algorithms.",
    status: "Available"
  },
  {
    id: 9,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    category: "Fiction",
    price: 14.50,
    quantity: 4,
    available_quantity: 4,
    published_date: "1925-04-10",
    description: "A classic novel depicting the roaring twenties, wealth, passion, and tragedy in Long Island.",
    status: "Available"
  },
  {
    id: 10,
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0262035613",
    category: "Data Science",
    price: 75.00,
    quantity: 2,
    available_quantity: 1,
    published_date: "2016-11-18",
    description: "An essential reference for students and software practitioners introducing deep learning mathematical background and techniques.",
    status: "Available"
  }
];

export const initialBorrowers = [
  {
    id: 1,
    name: "Alexander Wright",
    email: "alex.wright@university.edu",
    phone: "+1 (555) 234-5678",
    address: "104 Campus Drive, Apt 4B, University City",
    issued_books_count: 2
  },
  {
    id: 2,
    name: "Sophia Martinez",
    email: "sophia.m@student.org",
    phone: "+1 (555) 876-5432",
    address: "88 Science Park Way, Suite 12",
    issued_books_count: 1
  },
  {
    id: 3,
    name: "Marcus Chen",
    email: "marcus.chen@techinst.edu",
    phone: "+1 (555) 345-6789",
    address: "450 Innovation Ave, Building C",
    issued_books_count: 1
  },
  {
    id: 4,
    name: "Emily Watson",
    email: "emily.watson@library.org",
    phone: "+1 (555) 987-6543",
    address: "12 Pine Street, Oakridge",
    issued_books_count: 1
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@academics.com",
    phone: "+1 (555) 456-7890",
    address: "302 University Heights, West Wing",
    issued_books_count: 0
  }
];

export const initialIssueRecords = [
  {
    id: 1,
    book_id: 1,
    book_title: "Clean Code",
    borrower_id: 1,
    borrower_name: "Alexander Wright",
    issue_date: "2026-09-10",
    expected_return_date: "2026-09-24",
    return_date: null,
    status: "Overdue"
  },
  {
    id: 2,
    book_id: 2,
    book_title: "The Pragmatic Programmer",
    borrower_id: 1,
    borrower_name: "Alexander Wright",
    issue_date: "2026-09-18",
    expected_return_date: "2026-10-02",
    return_date: null,
    status: "Issued"
  },
  {
    id: 3,
    book_id: 3,
    book_title: "Design Patterns",
    borrower_id: 2,
    borrower_name: "Sophia Martinez",
    issue_date: "2026-09-20",
    expected_return_date: "2026-10-04",
    return_date: null,
    status: "Issued"
  },
  {
    id: 4,
    book_id: 5,
    book_title: "1984",
    borrower_id: 3,
    borrower_name: "Marcus Chen",
    issue_date: "2026-09-01",
    expected_return_date: "2026-09-15",
    return_date: null,
    status: "Overdue"
  },
  {
    id: 5,
    book_id: 7,
    book_title: "Atomic Habits",
    borrower_id: 4,
    borrower_name: "Emily Watson",
    issue_date: "2026-09-12",
    expected_return_date: "2026-09-26",
    return_date: "2026-09-25",
    status: "Returned"
  }
];
