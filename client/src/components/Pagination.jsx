

const Pagination = ({ postPerPage, totalPosts, paginate,currentPage  }) => {

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <button onClick={() => paginate(number)} className={currentPage === number ? 'pageNumber-btn-active' : 'pageNumber-btn'}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>


        </>
    )
}

export default Pagination
