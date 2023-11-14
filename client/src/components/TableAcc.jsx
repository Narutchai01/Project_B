
const TableAcc = ({score}) => {
    return (
        <>
            {score.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.score}</td>
                    <td>{item.date}</td>
                </tr>
            )
            )}
        </>
    )
}

export default TableAcc
