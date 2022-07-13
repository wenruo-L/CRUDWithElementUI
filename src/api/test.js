export const getList = (pageNumber, pageSize, params) => {
    return Promise.resolve({
        data: {
            data: {
                pageNumber,
                pageSize,
                ...params,
            }
        }
    })
}