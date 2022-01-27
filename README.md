Notes: *important* 

 I'm having a massive issue that is resulting in this failing/not being able to deploy. From the beginning, I haven't been able to knex migrate:make tableName. 
 
 It results specifically in this error: 
 TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
 
 There are more specifics to my error, specfically with 'migrator', yet this line is definitive to the error.
 
 Here's what I've done to attempt a fix: 
 
 First and foremost, I checked all my libraries when this occured. I re-installed, I npm installed knex, node, react, react-scrpts over again. Same error resulted. 
 
 Secondly, I looked into the error's specifics. Most, if not all, of the suggestions were to upgrade react-scripts. 
 I checked the version, it was 4.0.1(two versions back from latest stable) and I added "^4.0.3" and npm installed. I did it with 5.0.0 as well, to no luck. 
 
 Before looking for other options, I checked all of the .join(_dirname, "src", "db", "migrations") statements, I even changed them to static "src/db/migrations" to no luck.
 
 Then, thinking it was possibly something I had done in my code up to that point, I downloaded a zip of the starter project, and then followed the set-up from scratch again. After setup, I made sure to install and check all of my dependencies/libraries globally and specifically. Even then, I get the same error on knex migrate:make. 
 
 In this case, I reached out to my mentor, reached out to two tech coaches, and then Slack. I really gave it the day to try and solve this. As my time winds down in the program, I thought it would be best to patch the holes manually and submit it. 
 
 Now, you'll see I handmade the migrations file for 'tables'. This conflicts with listener on port, and if I removed the file, I was met with the message that my migrations were corrupt, because that file I made was missing. 
 
 So, unfortuately I did weasel my way in between a rock and a hard place, but I gave it my best shot. I reused a lot of code from my reservations folder for my tables. I knew generally what I needed to achieve, so I gave it a go. 
 
 I used every possible resource available to me to make sure that the tables folder was at least logically accurate. If the migration would work, it would fire off as expected. 
 
 If there is any idea of a solution for this problem, I'd love to know. I'm intrigued and want to do my best work!
 
 Thank you for your time! You'll also notice that the node_modules folders are missing and that's simply because GitHub didn't like the size of my upload. I would've just done it through GitHub desktop but I'm crunching for time on these submits.
 
 Again, thank you. Please let me know what I can do to finish this properly! 
 
 Wes
