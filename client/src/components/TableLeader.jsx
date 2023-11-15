import '../pages/leaderboard.css'

const TableLeader = ({score}) => {
    return (
        <>
        {score.map((item, index) => {
            return (
                <tr key={index} className="tablerow">
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.time}</td>
                    <td className='noright'>{item.date}</td>
                </tr>
            )
        })}
        </>
    )
}

export default TableLeader
