import { connection } from "../app/connect/mysql";



export const imageTest = async (
    podcastId: number
) => {
    const statement = `
     select image_data
     from podcast
     where id = ?
    
    `
    try {
        const [data] = await connection.promise().query(statement, podcastId);

        return data[0] ? data[0].image_data : null
    } catch (error) {
        console.log(error)
    }
}