import { useState } from "react"
import Persons from "./persons"

function Filter({ filter, onFilterChange }) {
    return (
        <div>
            <form>
                <div>
                    filter: <input value={filter} onChange={onFilterChange}/>
                </div>
            </form>
        </div>
    )
}
export default Filter