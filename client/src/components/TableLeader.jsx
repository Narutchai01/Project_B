
const TableLeader = ({score}) => {
    return (
        <>
        {score.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.time}</td>
                    <td>{item.date}</td>
                </tr>
            )
        })}
        </>
    )
}

export default TableLeader
