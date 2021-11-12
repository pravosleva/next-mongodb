deploy_path_build_dir=root@code-samples.space:/home/projects/next-mongodb/.next
deploy_path_server_dist_dir=root@code-samples.space:/home/projects/next-mongodb/server-dist
deploy_path_public_dir=root@code-samples.space:/home/projects/next-mongodb/public

echo '-- DEPLOY STARTED' &&

rsync -av --delete .next/ $deploy_path_build_dir &&
rsync -av --delete server-dist/ $deploy_path_server_dist_dir &&
rsync -av --delete public/ $deploy_path_public_dir &&

echo '-- DEPLOY COMPLETED'