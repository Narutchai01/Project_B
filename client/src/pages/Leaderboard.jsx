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
                                    <NavLink to={`/leaderboard/ez`}>
                                        Easy
                                    </NavLink>
                                </button>
                            </div>
                            <div className="difficulty-btn">
                                <button>
                                    <NavLink to={`/leaderboard/inter`}>
                                        Inter
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
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>score</th>
                                        <th>date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableLeader score={currentPost} />
                                    <Pagination postPerPage={postPerPage} totalPosts={score.length} paginate={pagination}/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leaderboard