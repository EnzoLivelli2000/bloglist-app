function Persons({ persons, onDeleted }) {
    return (
        <p>
            {persons.name} | {persons.number} <button onClick={onDeleted} >delete</button>
        </p>
    )

}

export default Persons