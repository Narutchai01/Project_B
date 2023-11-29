import './account.css'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { IoArrowUndoSharp } from 'react-icons/io5'
import { BiLogIn, BiSolidUser } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import TableAcc from '../components/TableAcc'
import Pagination from '../components/Pagination'

const Account = () => {

    const [user, setUser] = useState([])
    const { username, mode } = useParams()
    const [score, setScore] = useState([])
    const [gameData, setGameData] = useState([])
    const [winRate, setWinRate] = useState([])



    const userURL = `http://localhost:8080/api/${username}`
    const gameURL = `http://localhost:8080/api/showscore/${username}`
    const scoreURL = `http://localhost:8080/api/showscore/${username}/${mode}`
    const winratURL = `http://localhost:8080/api/showscorebyusername/${username}/WINNING`





    useEffect(() => {
        const getScore = async () => {
            await axios.get(winratURL).then((res) => {
                setWinRate(res.data)
            })
        }
        getScore()
    }, [winratURL])

    useEffect(() => {
        const getDataGame = async () => {
            await axios.get(gameURL).then((res) => {
                setGameData(res.data)
            })
        }
        getDataGame()
    }, [gameURL])


    useEffect(() => {
        const getUser = async () => {
            await axios.get(userURL).then((res) => {
                setUser(res.data)
            })
        }
        const getScoreByUser = async () => {
            await axios.get(scoreURL).then((res) => {
                setScore(res.data)
            })
        }
        getScoreByUser()
        getUser()
    }, [userURL, scoreURL])

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


    return (
        <>
            <div className="accountpage">
                <div className="container-account">
                    <div className="contant-account">
                        <div className="account-header">
                            <h1 className='back2homepage-btn'>
                                <Link to={`/Homepage/${username}`}>
                                    <IoArrowUndoSharp />
                                </Link>
                            </h1>
                            <div className='header-right'>
                                <h1>{user.username}</h1>
                                <div className='icon-user'>
                                    <BiSolidUser />
                                </div>
                            </div>
                        </div>
                        <div className="userinfo">
                            <div className="dataUser">
                                <h1>Username : {user.username}</h1>
                                <h1>Email : {user.email}</h1>
                            </div>
                            <h1>Game played : {gameData.length}</h1>
                            <div className="win-zone">
                                <h1>Game win : {winRate.length}</h1>
                                <h1>Win rate : {Math.round((winRate.length / gameData.length) * 100)} %</h1>
                            </div>
                            {/* <div className="win-zone">
                                <h1>Best time :  </h1>
                                <h1>high Score: 0 </h1>
                            </div> */}
                        </div>
                        <div className='acctable'>
                            <div className="difficulty">
                                <div className={mode === 'beginner' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/account/${username}/beginner`}>
                                            Beginner
                                        </NavLink>
                                    </button>
                                </div>
                                <div className={mode === 'intermediate' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/account/${username}/intermediate`}>
                                            Intermediate
                                        </NavLink>
                                    </button>
                                </div>
                                <div className={mode === 'expert' ? 'difficulty-btn-active' : 'difficulty-btn'}>
                                    <button>
                                        <NavLink to={`/account/${username}/expert`}>
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
                                            <th className='right'>score</th>
                                            <th>date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TableAcc score={currentPost} />
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

export default Account
