import '../pages/leaderboard.css'

const TableLeader = ({score}) => {
    return (
        <>
        {score.map((item, index) => {


            const time = `${item.time.minutes.toString().padStart(2,"0")}:${item.time.seconds.toString().padStart(2,"0")}`

            return (
                <tr key={index} className="tablerow">
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td >{time}</td>
                    <td className='noright'>{item.date}</td>
                </tr>
            )
        })}
        </>
    )
}

export default TableLeader
