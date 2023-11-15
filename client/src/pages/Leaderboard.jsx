import './leaderboard.css'
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import TableLeader from '../components/TableLeader'
import Pagination from '../components/Pagination'
import { IoArrowUndoSharp } from 'react-icons/io5'

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
                            <div className='Return logo'>
                                <IoArrowUndoSharp className='ReturnLeaderboard'/>
                            </div>
                            <h1 className='Maintitle'>
                                Leaderboard
                            </h1>
                        </div>
                        <div className='leadertable'>    
                            <div className="difficulty">
                                <div className="difficulty-btn">
                                    <button>
                                        <NavLink to={`/leaderboard/beginner`}>
                                            Beginner
                                        </NavLink>
                                    </button>
                                </div>
                                <div className="difficulty-btn">
                                    <button>
                                        <NavLink to={`/leaderboard/intermediate`}>
                                            Intermediate
                                        </NavLink>
                                    </button>
                                </div>
                                <div className="difficulty-btn">
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
                                    <tbody className='row'>
                                        <TableLeader score={currentPost} />
                                    </tbody>
                                </table>
                            </div>
                            <Pagination postPerPage={postPerPage} totalPosts={score.length} paginate={pagination}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard
