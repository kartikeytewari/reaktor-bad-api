rm all.txt
touch all.txt

cat beanies.txt > all.txt
cat facemask.txt >> all.txt 
cat gloves.txt >> all.txt 

g++ -o main.out main.cpp
./main.out < all.txt 