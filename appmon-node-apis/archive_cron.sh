FILEPATH=$( echo "$(cd "$(dirname "$1")" && pwd -P)/$(basename "$1")")
crontab -l > job_archive
echo "0 7 * * 0 /bin/sh ${FILEPATH}archive.sh" >> job_archive
crontab job_archive
rm job_archive