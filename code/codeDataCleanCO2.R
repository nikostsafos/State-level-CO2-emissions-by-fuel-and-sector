library(xlsx)

setwd("~/Dropbox/- Code/- Github/us emissions by state/code")

states = tolower(state.name)
states = append(states, 'district of columbia')
states = gsub('[[:space:]]','%20', states)

dat = c()
for (i in states) {
        states = i
        temp = read.xlsx(paste0('../rawData/byState/', states, '.xlsx'),
                         sheetName = 1,
                         rowIndex = 4:34,
                         colIndex = 1:37,
                         stringsAsFactors=FALSE)
        temp$Sector = rep(
                c("Residential", "Commercial", 
                  "Industry", "Transport", 
                  "Electricity"),
                each = 6)
        temp$State = states
        temp$State = gsub('%20', ' ', temp$State)
        colnames(temp)[2] = 'Fuel'
        temp = temp[,c(39, 38, 2:37)]
        temp = temp[!is.na(temp$Fuel),]
        temp = melt(temp, id.vars = c('State', 'Sector', 'Fuel'))
        colnames(temp)[4:5] = c('Year', 'Value')
        temp$Year <- gsub("X","", temp$Year) # eliminate X from year column
        temp$Year = as.integer(temp$Year)
        temp$Value = as.numeric(temp$Value)
        dat = rbind(dat, temp)
}
rm(i, states, temp)

states = state.name
states = append(states, 'District of Columbia')

dat$State = rep(states, each = 700)

write.csv(dat, '../cleanData/co2EmissionsByState.csv', row.names = F)

###### CREATE SUBSET FOR WEB RENDERING ####
dat = read.csv('../cleanData/co2EmissionsByState.csv', header = T, stringsAsFactors = F)
dat$Fuel <- gsub("Petroleum Products","Oil", dat$Fuel)
dat$Fuel <- gsub("Natural Gas","Gas", dat$Fuel)

dat = dat[!dat$Fuel == 'Total',]
datSector = aggregate(Value ~ Sector + Year + State, data = dat, sum)
datFuel = aggregate(Value ~ Fuel + Year + State, data = dat, sum)
colnames(datSector)[1] = 'Variable'
colnames(datFuel)[1] = 'Variable'
dat = rbind(datSector, datFuel)
dat = spread(dat, Variable, Value)
dat = subset (dat, select = c('Year', 'State',
                              'Coal', 'Oil', 'Gas',
                              'Residential', 'Commercial', 'Industry', 'Transport', 'Electricity'))
write.csv(dat, '../cleanData/co2emissions.csv', row.names = F)
