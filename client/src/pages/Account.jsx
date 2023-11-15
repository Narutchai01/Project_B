import './account.css'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { IoArrowUndoSharp } from 'react-icons/io5'
import { BiSolidUser } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import TableAcc from '../components/TableAcc'
import Pagination from '../components/Pagination'

const Account = () => {

    const [user, setUser] = useState([])
    const { username, mode } = useParams()
    const [score, setScore] = useState([])



    const userURL = `http://localhost:8080/api/${username}`
    const scoreURL = `http://localhost:8080/api/showscore/${username}/${mode}`


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


    // console.log(user);

    return (
        <>
            <div className="account">
                <div className="container-account">
                    <div className="contant-account">
                        <div className="account-header">
                            <h1><IoArrowUndoSharp /></h1>
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
                            <h1>Game played : 10000</h1>
                            <div className="win-zone">
                                <h1>Game win : 0</h1>
                                <h1>Win rate : 0 %</h1>
                            </div>
                            <div className="win-zone">
                                <h1>Best time : 0</h1>
                                <h1>high Score: 0 </h1>
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
                                    <TableAcc score={currentPost}/>
                                    <Pagination postPerPage={currentPost} totalPosts={score.length} paginate={pagination}/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Account
