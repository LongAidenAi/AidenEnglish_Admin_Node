import { connection } from "../app/connect/mysql";


export const getTagList = async (
) => {
    const statement = `
      select *
      from tag
    `
    try {
      const [data] = await connection.promise().query(statement);
      return data
    } catch (error) {
      throw new Error(`数据库错误，获取标签列表失败:${error.message}`);
    }
}

/***
 * 保存播客的tags
 */
export const savePodcastTag = async (
  podcastTagIdList: any, podcast_id: number
) => {
    const statement = `
    INSERT INTO podcast_tag (podcast_id, tag_id) VALUES ?;
    `
    const values = podcastTagIdList.map((tagId: number) => [podcast_id, tagId]);

    try {
      await connection.promise().query(statement, [values]);
    } catch (error) {
      console.log(error)
      throw new Error(`将播客的标签保存到数据库成功:${error.message}`);
    }
}


/***
 * 保存播客难度等级
 */
export const savePodcastLevel = async (
  podcast_id: number,totalScore: number,podcast_level: string
) => {
    const statement = `
      INSERT INTO podcast_level (podcast_id, total_score, podcast_level) VALUES 
      (?,?,?);
    `

    try {
      await connection.promise().query(statement, [podcast_id,totalScore,podcast_level]);
    } catch (error) {
      console.log(error)
      throw new Error(`保存播客难度等级失败:${error.message}`);
    }
}

/***
 * 判断播客相关标签是否存在
 */
export const getPodcastTagInfoById = async (
  podcast_id: number
) => {
  const statement = `
  SELECT podcast_id
  FROM podcast_level
  WHERE podcast_id = ?
`
try {
  const [data] = await connection.promise().query(statement, podcast_id);

  return data[0] ? data[0] : null
} catch (error) {
  console.log(error)
  throw new Error(`保存播客难度等级失败:${error.message}`);
}
}