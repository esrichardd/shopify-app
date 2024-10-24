export const getCompanyIdByStoreId = (storeId: string): string => {

    switch (storeId) {
        case '61689790579':
        case '61689790575':
            return 'loggy-cl'
        case '61689790573':
            return 'neotedma-cl'
        }
    return 'loggy-cl'

}