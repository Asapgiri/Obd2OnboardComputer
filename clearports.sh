uid=`ps -A | grep node | cut -d" " -f2`

kill $uid
