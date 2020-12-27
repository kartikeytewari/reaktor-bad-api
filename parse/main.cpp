#include <bits/stdc++.h>
#define ll long long
#define ld long double
#define endl "\n"
#define n 18402
using namespace std;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    map<string,bool> alpha;
    for (int i=0;i<=n-1;i++)
    {
        string s;
        cin >> s;
        alpha[s]=true;
    }

    for (auto it=alpha.begin();it!=alpha.end();it++)
    {
        cout << it->first << endl;
    }

    return 0;
}