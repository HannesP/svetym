#!/bin/bash

FIRST=89
LAST=1336

mkdir html
cd html

for i in `seq $FIRST $LAST`;
do
	fname=`printf "%04d.html" $i`
	curl -O "http://runeberg.org/svetym/$fname"
done
