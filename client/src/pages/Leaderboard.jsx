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


    console.log(score);

    return (
        <>
            <div className='leaderboard'>
                <div className='container-leaderboard'>
                    <div className='contant'>
                        <div className="title">
                            <h1>Leaderboard</h1>
                        </div>
                        <div className="difficulty">
                            <div className="difficulty-btn">
                                <button>
                                    <NavLink to={`/leaderboard/Beginner`}>
                                        Beginner
                                    </NavLink>
                                </button>
                            </div>
                            <div className="difficulty-btn">
                                <button>
                                    <NavLink to={`/leaderboard/Intermediate`}>
                                        Intermediate
                                    </NavLink>
                                </button>
                            </div>
                            <div className="difficulty-btn">
                                <button>
                                    <NavLink to={`/leaderboard/Expert`}>
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
                        <Pagination postPerPage={postPerPage} totalPosts={score.length} paginate={pagination}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard
