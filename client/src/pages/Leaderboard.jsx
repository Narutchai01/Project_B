import './leaderboard.css'
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import TableLeader from '../components/TableLeader'
import Pagination from '../components/Pagination'

const Leaderboard = () => {

    const { mode } = useParams()
    const scoreURL = `http://localhost:8080/api/showscore/${mode}`

    const [score, setScore] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(8)
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const currentPost = score.slice(indexOfFirstPost, indexOfLastPost)
    const pagination = (pageNumber) => setCurrentPage(pageNumber)




    useEffect(() => {
        const getScore = async () => {
            await axios.get(scoreURL).then((res) => {
                setScore(res.data)
            })
        }
        getScore()
    }, [scoreURL])


    // console.log(score);
    console.log(currentPage);

    return (
        <>
            <div className='leaderboard'>
                <div className='container-leaderboard'>
                    <div className='contant'>
                        <div className="title">
                            <h1>Leaderboard</h1>
                        </div>
                        <div className="difficulty">
                            <div className={mode === 'beginner'? 'difficulty-btn-active' : 'difficulty-btn'  }>
                                <button>
                                    <NavLink to={`/leaderboard/beginner`}>
                                        Beginner
                                    </NavLink>
                                </button>
                            </div>
                            <div className={mode === 'intermediate'? 'difficulty-btn-active' : 'difficulty-btn'  }>
                                <button>
                                    <NavLink to={`/leaderboard/intermediate`}>
                                        Intermediate
                                    </NavLink>
                                </button>
                            </div>
                            <div className={mode === 'expert'? 'difficulty-btn-active' : 'difficulty-btn'  }>
                                <button>
                                    <NavLink to={`/leaderboard/expert`}>
                                        Expert
                                    </NavLink>
                                </button>
                            </div>
                        </div>
                        <div className="tablescore">
                            <table>
                                <thead>
                                    <tr>
                                        <th className='right'>Rank</th>
                                        <th className='right'>Name</th>
                                        <th className='right'>Time</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableLeader score={currentPost} />
                                </tbody>
                            </table>
                        </div>
                    <Pagination postPerPage={postPerPage} totalPosts={score.length} paginate={pagination} currentPage={currentPage}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard
