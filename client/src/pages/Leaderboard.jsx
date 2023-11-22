import './leaderboard.css'
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import TableLeader from '../components/TableLeader'
import Pagination from '../components/Pagination'
import { IoArrowUndoSharp } from 'react-icons/io5'

const Leaderboard = () => {

    const { username, mode } = useParams()
    const scoreURL = `http://localhost:8080/api/showscorebymode/${mode}`

    const [score, setScore] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(8)
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const currentPost = score.slice(indexOfFirstPost, indexOfLastPost)
    const pagination = (pageNumber) => setCurrentPage(pageNumber)


    score.sort((a, b) => {
        if (a.time.minutes < b.time.minutes) {
            return -1
        }
        if (a.time.minutes > b.time.minutes) {
            return 1
        }
        if (a.time.seconds < b.time.seconds) {
            return -1
        }
        if (a.time.seconds > b.time.seconds) {
            return 1
        }
        if (a.time.milliseconds < b.time.milliseconds) {
            return -1
        }
        if (a.time.milliseconds > b.time.milliseconds) {
            return 1
        }
        return 0
    });

    


    useEffect(() => {
        const getScore = async () => {
            await axios.get(scoreURL).then((res) => {
                setScore(res.data)
            })
        }
        getScore()
    }, [scoreURL])


    // console.log(score);
    // console.log(currentPage);

    return (
        <>
            <div className='leaderboard'>
                <div className='container-leaderboard'>
                    <div className='content'>
                        <div className="title">
                            <h1 className='Returnbtn'>
                                <NavLink to={`/Homepage/${username}`}>
                                    <IoArrowUndoSharp />
                                </NavLink>
                            </h1>
                            <div className='Maintitle'>
                                <h1>Leaderboard</h1>
                            </div>
                        </div>
                        <div className='leadertable'>
                            <div className="difficulty">
                                <div className={mode === 'beginner' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/${username}/leaderboard/beginner`}>
                                            Beginner
                                        </NavLink>
                                    </button>
                                </div>
                                <div className={mode === 'intermediate' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/${username}/leaderboard/intermediate`}>
                                            Intermediate
                                        </NavLink>
                                    </button>
                                </div>
                                <div className={mode === 'expert' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/${username}/leaderboard/expert`}>
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
                                    <tbody className='row'>
                                        <TableLeader score={currentPost} />
                                    </tbody>
                                </table>
                            </div>
                            <Pagination postPerPage={postPerPage} totalPosts={score.length} paginate={pagination} currentPage={currentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard
