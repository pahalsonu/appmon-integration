#!/bin/sh
##################################################################
# Job To archive the Log Files 
##################################################################
SUCCESS=0
ERROR=255

date_str=$(date +%Y%m%d%H%M%S)
source_dir="logs"
source_file="appmon"
archive_dir="logs/archives"
archive_file="appmon"
days_to_archive=7
logfile="logs/log.json"

log() {
    echo "{ \"status\": \"$1\", \"message\": \"$2\" }" >> ${logfile}
}

touch ${logfile}
no_of_files=`find ${source_dir} -name "${source_file}*.log" -type f -mtime +${days_to_archive} | wc -l | tr -d " "`

if [ $? -ne 0 ]
then
     log ERROR "Error Finding files to archive";
     exit ${ERROR};
elif [ -z "${no_of_files}" ] || [[ ${no_of_files} -eq 0 ]]
then
     log SUCCESS "There are no files to archive";
else
    if [ ! -d ${archive_dir} ]
    then
        mkdir -p ${archive_dir}
        if [ $? -ne 0 ]
        then
            log ERROR "Unable to create Directory";
            exit ${ERROR};
        fi
    fi

    find ${source_dir} -name "${source_file}*.log" -type f -mtime +${days_to_archive} | xargs tar cvfz ${archive_dir}/${archive_file}_${date_str}.tar.gz &>/dev/null
    if [ $? -ne 0 ]
    then
        log ERROR "Unable to Archive the files";
        exit ${ERROR};
    else
        find ${source_dir} -name "${source_file}*.log" -type f -mtime +${days_to_archive} -exec rm -f {} \;
        if [ $? -ne 0 ]
        then
            log ERROR "Unable to Remove the files";
            exit ${ERROR};
        else
            log SUCCESS "Files Archived and removed Successfully";
        fi
    fi
fi

exit ${SUCCESS};

