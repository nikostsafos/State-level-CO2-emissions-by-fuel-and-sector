#### Libraries ####
library(xlsx)

# http://www.eia.gov/environment/emissions/state/

#### Download state-level files ####
states = tolower(state.name)
states = append(states, 'district of columbia')
states = gsub('[[:space:]]','%20', states)
dc = subset(states, grepl('%20', states))[11]
states = states[!states %in% dc]

for (i in states) {
        fileURL = paste0('https://www.eia.gov/environment/emissions/state/excel/', i, '.xlsx')
        destf = paste0('../rawData/', i, '.xlsx')
        download.file(fileURL, destfile=destf, method = 'curl')
}

for (i in dc) {
        dc = i
        fileURL = paste0('https://www.eia.gov/environment/emissions/state/excel/', dc, '.xlsx')
        destf = paste0('../rawData/', dc, '.xlsx')
        download.file(fileURL, destfile=destf, method = 'curl')
}

rm(destf, fileURL, i, states, dc)
